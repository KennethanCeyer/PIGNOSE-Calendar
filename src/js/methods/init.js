define([
    '../manager/index',
    '../component/classNames',
    '../component/helper',
    '../component/models',
    '../component/global',
    './configure',
    'jquery',
    'moment'
], (DateManager,
    classNames,
    helper,
    models,
    global,
    methodConfigure,
    $,
    moment) => {
    const $window = $(window);
    return function (options) {
        const context = this;

        context.settings = {};
        methodConfigure.call(context, options);

        context.global = {
            calendarHtml: helper.format('<div class="{0} {0}-{4}">\
                                    <div class="{1}">\
                                      <a href="#" class="{1}-nav {1}-prev">\
                                          <span class="icon-arrow-left {1}-icon"></span>\
                                      </a>\
                                      <div class="{1}-date">\
                                          <span class="{1}-month"></span>\
                                          <span class="{1}-year"></span>\
                                      </div>\
                                      <a href="#" class="{1}-nav {1}-next">\
                                          <span class="icon-arrow-right {1}-icon"></span>\
                                      </a>\
                                    </div>\
                                    <div class="{2}"></div>\
                                    <div class="{3}"></div>\
                                  </div>', helper.getClass(models.name), classNames.top, classNames.header, classNames.body, context.settings.theme),
            calendarButtonsHtml: helper.format('<div class="{0}-group">\
                                            <a href="#" class="{0} {0}-cancel">{1}</a>\
                                            <a href="#" class="{0} {0}-apply">{2}</a>\
                                          </div>', classNames.button, context.settings.controls.cancel, context.settings.controls.ok),
            calendarScheduleContainerHtml: helper.format('<div class="{0}-schedule-container"></div>', classNames.button),
            calendarSchedulePinHtml: helper.format('<span class="{0}-schedule-pin {0}-schedule-pin-\\{0\\}" style="background-color: \\{1\\};"></span>', classNames.button),
        };

        const rangeClass = helper.getSubClass('unitRange');
        const rangeFirstClass = helper.getSubClass('unitRangeFirst');
        const rangeLastClass = helper.getSubClass('unitRangeLast');
        const activeClass = helper.getSubClass('unitActive');
        const activePositionClasses = [helper.getSubClass('unitFirstActive'), helper.getSubClass('unitSecondActive')];
        const toggleActiveClass = helper.getSubClass('unitToggleActive');
        const toggleInactiveClass = helper.getSubClass('unitToggleInactive');
        let $calendarButton = null;

        return context.each((_, element) => {
            const $this = $(element);
            const local = {
                initialize: null,
                element: $this,
                calendar: $(context.global.calendarHtml),
                input: $this.is('input'),
                renderer: null,
                current: [null, null],
                date: {
                    all: [],
                    enabled: [],
                    disabled: []
                },
                storage: {
                    activeDates: [],
                    schedules: []
                },
                dateManager: new DateManager(context.settings.date),
                calendarWrapperHtml: helper.format('<div class="{0}"></div>', helper.getSubClass('wrapper')),
                calendarWrapperOverlayHtml: helper.format('<div class="{0}"></div>', helper.getSubClass('wrapperOverlay')),
                context: context
            };
            let $parent = $this;

            if (context.settings.initialize)
                local.initialize = local.current[0] = local.dateManager.date.clone();

            this.local = local;

            if (context.settings.reverse)
                local.calendar.addClass(helper.getSubClass('reverse'));
            else
                local.calendar.addClass(helper.getSubClass('default'));

            for (let i = context.settings.week; i < context.settings.weeks.length + context.settings.week; i++) {
                if (i < 0)
                    i = global.languages.weeks.en.length - i;

                let week = context.settings.weeks[i % context.settings.weeks.length];
                if (typeof week !== 'string')
                    continue;

                week = week.toUpperCase();
                const $unit = $(helper.format('<div class="{0} {0}-{2}">{1}</div>', helper.getSubClass('week'), week, global.languages.weeks.en[i % global.languages.weeks.en.length].toLowerCase()));
                $unit.appendTo(local.calendar.find(`.${classNames.header}`));
            }

            if (context.settings.buttons) {
                $calendarButton = $(context.global.calendarButtonsHtml);
                $calendarButton.appendTo(local.calendar);
            }

            if (local.input || context.settings.modal) {
                const wrapperActiveClass = helper.getSubClass('wrapperActive');
                const overlayActiveClass = helper.getSubClass('wrapperOverlayActive');
                let $overlay;

                $parent = $(local.calendarWrapperHtml);
                $parent.bind('click', event => event.stopPropagation());

                $this
                    .bind('click', event => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        $overlay = $(`.${helper.getSubClass('wrapperOverlay')}`);

                        if (!$overlay.length) {
                            $overlay = $(local.calendarWrapperOverlayHtml);
                            $overlay.appendTo('body');
                        }

                        $overlay
                            .unbind(`click.${helper.getClass(models.name)}`)
                            .bind(`click.${helper.getClass(models.name)}`, event => {
                                event.stopPropagation();
                                $parent.trigger(`cancel.${helper.getClass(models.name)}`);
                            });

                        if (!$parent.parent().is('body'))
                            $parent.appendTo('body');

                        $parent.show();
                        $overlay.show();

                        $window
                            .unbind(`resize.${helper.getClass(models.name)}`)
                            .bind(`resize.${helper.getClass(models.name)}`, () => {
                                $parent.css({
                                    marginLeft: -$parent.outerWidth() / 2,
                                    marginTop: -$parent.outerHeight() / 2
                                });
                            })
                            .triggerHandler(`resize.${helper.getClass(models.name)}`);

                        $this[models.name]('set', $this.val());

                        setTimeout(() => {
                            $overlay.addClass(overlayActiveClass);
                            $parent.addClass(wrapperActiveClass);
                        }, 25);
                    })
                    .bind('focus', event => $(event.currentTarget).blur());

                $parent
                    .unbind(`cancel.${helper.getClass(models.name)} apply.${helper.getClass(models.name)}`)
                    .bind(`cancel.${helper.getClass(models.name)} apply.${helper.getClass(models.name)}`, () => {
                        $overlay.removeClass(overlayActiveClass).hide();
                        $parent.removeClass(wrapperActiveClass).hide();
                    });
            }

            const generateDateRange = () => {
                if (!local.current[0] || !local.current[1])
                    return false;

                const firstSelectDate = local.current[0].format('YYYY-MM-DD');
                const lastSelectDate = local.current[1].format('YYYY-MM-DD');
                const firstDate = moment(Math.max(local.current[0].valueOf(), local.dateManager.date.clone().startOf('month').valueOf()));
                const lastDate = moment(Math.min(local.current[1].valueOf(), local.dateManager.date.clone().endOf('month').valueOf()));
                const firstDateIsUndered = (firstDate.format('YYYY-MM-DD') !== firstSelectDate);
                const lastDateIsOvered = (lastDate.format('YYYY-MM-DD') !== lastSelectDate);

                if (!firstDateIsUndered) firstDate.add(1, 'days');
                if (!lastDateIsOvered) lastDate.add(-1, 'days');

                const firstDateFixed = firstDate.format('YYYY-MM-DD');
                const lastDateFixed = lastDate.format('YYYY-MM-DD');

                for (; firstDate.format('YYYY-MM-DD') <= lastDate.format('YYYY-MM-DD'); firstDate.add(1, 'days')) {
                    const date = firstDate.format('YYYY-MM-DD');
                    const $target = local.calendar
                        .find(helper.format('.{0}[data-date="{1}"]', helper.getSubClass('unit'), date))
                        .addClass(rangeClass);

                    if (date === firstDateFixed)
                        $target.addClass(rangeFirstClass);

                    if (date === lastDateFixed)
                        $target.addClass(rangeLastClass);
                }
            };

            const existsBetweenRange = (startDate, endDate, targetDate) =>
                targetDate && startDate.diff(targetDate) < 0 && endDate.diff(targetDate) > 0;

            const validDate = date => {
                if (context.settings.disabledDates.includes(date)) return false;
                if (date.diff(context.settings.maxDate) >= 0) return false;
                if (date.diff(context.settings.minDate) <= 0) return false;

                for (const idx in context.settings.disabledRanges) {
                    const rangeDate = context.settings.disabledRanges[idx];
                    const startRangeDate = moment(rangeDate[0]);
                    const endRangeDate = moment(rangeDate[1]);

                    if (existsBetweenRange(startRangeDate, endRangeDate, date))
                        return false;
                }


                const weekday = date.weekday();
                return !context.settings.disabledWeekdays.includes(weekday);
            };

            const validDateArea = (startDate, endDate) => {
                let date;

                for (const idx in context.settings.disabledDates) {
                    date = moment(context.settings.disabledDates[idx]);
                    if (existsBetweenRange(startDate, endDate, date))
                        return false;
                }

                if (existsBetweenRange(startDate, endDate, context.settings.maxDate))
                    return false;

                if (existsBetweenRange(startDate, endDate, context.settings.minDate))
                    return false;

                for (const idx in context.settings.disabledRanges) {
                    const rangeDate = context.settings.disabledRanges[idx];
                    const startRangeDate = moment(rangeDate[0]);
                    const endRangeDate = moment(rangeDate[1]);

                    if (
                        existsBetweenRange(startDate, endDate, startRangeDate) ||
                        existsBetweenRange(startDate, endDate, endRangeDate)
                    )
                        return false;
                }

                let startWeekday = startDate.weekday();
                let endWeekday = endDate.weekday();
                let tmp;

                if (startWeekday > endWeekday) {
                    tmp = startWeekday;
                    startWeekday = endWeekday;
                    endWeekday = tmp;
                }

                for (let idx = 0, index = 0; idx < context.settings.disabledWeekdays.length && index < 7; idx++) {
                    index++;
                    const week = context.settings.disabledWeekdays[idx];

                    if (week >= startWeekday && week <= endWeekday)
                        return false;
                }

                return true;
            };

            local.renderer = () => {
                local.calendar.appendTo($parent.empty());
                local.calendar.find(`.${classNames.top}-year`).text(local.dateManager.year);
                local.calendar.find(`.${classNames.top}-month`).text(context.settings.monthsLong[local.dateManager.month - 1]);
                local.calendar.find(helper.format('.{0}-prev .{0}-value', classNames.top)).text(context.settings.months[local.dateManager.prevMonth - 1].toUpperCase());
                local.calendar.find(helper.format('.{0}-next .{0}-value', classNames.top)).text(context.settings.months[local.dateManager.nextMonth - 1].toUpperCase());

                if (context.settings.buttons && $calendarButton) {
                    const $super = $this;
                    $calendarButton.find(`.${classNames.button}`).bind('click', event => {
                        event.preventDefault();
                        event.stopPropagation();
                        const $this = $(event.currentTarget);

                        if ($this.hasClass(`${classNames.button}-apply`)) {
                            $this.trigger('apply.' + models.name, local);
                            let value = '';
                            if (context.settings.toggle)
                                value = local.storage.activeDates.join(', ');
                            else if (context.settings.multiple) {
                                const dateValues = [];

                                if (local.current[0] !== null)
                                    dateValues.push(local.current[0].format(context.settings.format));

                                if (local.current[1] !== null)
                                    dateValues.push(local.current[1].format(context.settings.format));

                                value = dateValues.join(' ~ ');
                            }
                            else
                                value = local.current[0] === null
                                    ? ''
                                    : moment(local.current[0]).format(context.settings.format);

                            if (local.input)
                                $super.val(value).triggerHandler('change');

                            if (typeof context.settings.apply === 'function')
                                context.settings.apply.call(local.calendar, local.current, local);

                            $parent.triggerHandler(`apply.${helper.getClass(models.name)}`);
                        }
                        else
                            $parent.triggerHandler(`cancel.${helper.getClass(models.name)}`);
                    });
                }

                const $calendarBody = local.calendar.find(`.${classNames.body}`).empty();
                const firstDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.firstDay);
                const lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
                let firstWeekday = firstDate.weekday() - context.settings.week;
                let lastWeekday = lastDate.weekday() - context.settings.week;

                if (firstWeekday < 0)
                    firstWeekday += context.settings.weeks.length;

                const $unitList = [];
                const currentFormat = [
                        local.current[0] === null ? null : local.current[0].format('YYYY-MM-DD'),
                        local.current[1] === null ? null : local.current[1].format('YYYY-MM-DD')
                    ];
                const minDate = context.settings.minDate === null ? null : moment(context.settings.minDate);
                const maxDate = context.settings.maxDate === null ? null : moment(context.settings.maxDate);

                for (let i = 0; i < firstWeekday; i++) {
                    $unitList.push($(helper.format(
                        '<div class="{0} {0}-{1}"></div>',
                        helper.getSubClass('unit'),
                        global.languages.weeks.en[i].toLowerCase()
                    )));
                }

                for (let i = local.dateManager.firstDay; i <= local.dateManager.lastDay; i++) {
                    const iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, i);
                    const iDateFormat = iDate.format('YYYY-MM-DD');
                    const $unit = $(helper.format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', helper.getSubClass('unit'), iDate.format('YYYY-MM-DD'), i, global.languages.weeks.en[iDate.weekday()].toLowerCase()));

                    if (
                        context.settings.enabledDates.length &&
                        !context.settings.enabledDates.includes(iDateFormat)
                    )
                        $unit.addClass(helper.getSubClass('unitDisabled'));
                    else if (
                        context.settings.disabledWeekdays.length &&
                        context.settings.disabledWeekdays.includes(iDate.weekday())
                    )
                        $unit
                            .addClass(helper.getSubClass('unitDisabled'))
                            .addClass(helper.getSubClass('unitDisabledWeekdays'));
                    else if (
                        (minDate !== null && minDate.diff(iDate) > 0) ||
                        (maxDate !== null && maxDate.diff(iDate) < 0)
                    ) {
                        $unit.addClass(helper.getSubClass('unitDisabled')).addClass(helper.getSubClass('unitDisabledRange'));
                    }
                    else if ($.inArray(iDateFormat, context.settings.disabledDates) !== -1) {
                        $unit.addClass(helper.getSubClass('unitDisabled'));
                    }
                    else if (context.settings.disabledRanges.length) {
                        const disabledRangesLength = context.settings.disabledRanges.length;
                        for (let j = 0; j < disabledRangesLength; j++) {
                            const disabledRange = context.settings.disabledRanges[j];
                            if (iDate.diff(moment(disabledRange[0])) >= 0 && iDate.diff(moment(disabledRange[1])) <= 0) {
                                $unit.addClass(helper.getSubClass('unitDisabled')).addClass(helper.getSubClass('unitDisabledRange')).addClass(helper.getSubClass('unitDisabledMultipleRange'));
                                break;
                            }
                        }
                    }

                    if (
                        context.settings.schedules.length &&
                        typeof context.settings.scheduleOptions === 'object' &&
                        typeof context.settings.scheduleOptions.colors === 'object'
                    ) {
                        const currentSchedules = context.settings.schedules
                            .filter(schedule => schedule.date === iDateFormat);
                        const nameOfSchedules = $.unique(currentSchedules.map(schedule => schedule.name).sort());

                        if (nameOfSchedules.length) {
                            const $schedulePinContainer = $(context.global.calendarScheduleContainerHtml);
                            $schedulePinContainer.appendTo($unit);
                            nameOfSchedules
                                .filter(name => context.settings.scheduleOptions.colors[name])
                                .map(name => {
                                    const color = context.settings.scheduleOptions.colors[name];
                                    const $schedulePin = $(helper.format(context.global.calendarSchedulePinHtml, name, color));
                                    $schedulePin.appendTo($schedulePinContainer);
                                });
                        }
                    }

                    if (context.settings.toggle)
                        $unit.addClass(
                            (local.storage.activeDates.includes(iDateFormat) && local.storage.activeDates.length)
                                ? toggleActiveClass
                                : toggleInactiveClass
                        );
                    else if (!$unit.hasClass(helper.getSubClass('unitDisabled'))) {
                        if (context.settings.multiple) {
                            if ((currentFormat[0] && iDateFormat === currentFormat[0]))
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);

                            if ((currentFormat[1] && iDateFormat === currentFormat[1]))
                                $unit.addClass(activeClass).addClass(activePositionClasses[1]);
                        }
                        else {
                            if ((currentFormat[0] && iDateFormat === currentFormat[0]) &&
                                $.inArray(currentFormat[0], context.settings.disabledDates) === -1 &&
                                (!context.settings.enabledDates.length || context.settings.enabledDates.includes(currentFormat[0])))
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                        }
                    }

                    $unitList.push($unit);
                    const $super = $this;

                    $unit.bind('click', event => {
                        event.preventDefault();
                        event.stopPropagation();

                        const $this = $(event.currentTarget);
                        const date = $this.data('date');
                        let position = 0;
                        let preventSelect = false;

                        if ($this.hasClass(helper.getSubClass('unitDisabled')))
                            preventSelect = true;
                        else {
                            if (local.input && !context.settings.multiple && !context.settings.buttons) {
                                $super.val(moment(date).format(context.settings.format));
                                $parent.triggerHandler(`apply.${helper.getClass(models.name)}`);
                            }
                            else if (
                                !local.initialize ||
                                local.initialize.format('YYYY-MM-DD') !== date ||
                                context.settings.toggle
                            ) {
                                if (context.settings.toggle) {
                                    const match = local.storage.activeDates.filter(activeDate => activeDate === date);
                                    local.current[position] = moment(date);

                                    if (!match.length) {
                                        local.storage.activeDates.push(date);
                                        $this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
                                    }
                                    else {
                                        let index = 0;
                                        for (let idx = 0; idx < local.storage.activeDates.length; idx++) {
                                            const targetDate = local.storage.activeDates[idx];

                                            if (date === targetDate) {
                                                index = idx;
                                                break;
                                            }
                                        }
                                        local.storage.activeDates.splice(index, 1);
                                        $this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
                                    }
                                }
                                else if (
                                    $this.hasClass(activeClass) &&
                                    !context.settings.pickWeeks
                                ) {
                                    if (context.settings.multiple) {
                                        if ($this.hasClass(activePositionClasses[0]))
                                            position = 0;
                                        else if (activePositionClasses[1])
                                            position = 1;
                                    }
                                    $this.removeClass(activeClass).removeClass(activePositionClasses[position]);
                                    local.current[position] = null;
                                }
                                else {
                                    if (context.settings.pickWeeks) {
                                        if ($this.hasClass(activeClass) || $this.hasClass(rangeClass)) {
                                            for (let j = 0; j < 2; j++) {
                                                local.calendar
                                                    .find(`.${activeClass}.${activePositionClasses[j]}`)
                                                    .removeClass(activeClass)
                                                    .removeClass(activePositionClasses[j]);
                                                local.current[j] = null;
                                            }
                                        } else {
                                            local.current[0] = moment(date).startOf('week').add(context.settings.week, 'days');
                                            local.current[1] = moment(date).endOf('week').add(context.settings.week, 'days');

                                            for (let j = 0; j < 2; j++) {
                                                local.calendar
                                                    .find(`.${activeClass}.${activePositionClasses[j]}`)
                                                    .removeClass(activeClass)
                                                    .removeClass(activePositionClasses[j]);

                                                local.calendar
                                                    .find(helper.format(
                                                        '.{0}[data-date="{1}"]',
                                                        helper.getSubClass('unit'),
                                                        local.current[j].format('YYYY-MM-DD')
                                                    ))
                                                    .addClass(activeClass)
                                                    .addClass(activePositionClasses[j]);
                                            }
                                        }
                                    } else {
                                        if (context.settings.multiple) {
                                            if (local.current[0] === null)
                                                position = 0;
                                            else if (local.current[1] === null)
                                                position = 1;
                                            else {
                                                position = 0;
                                                local.current[1] = null;
                                                local.calendar
                                                    .find(`.${activeClass}.${activePositionClasses[1]}`)
                                                    .removeClass(activeClass)
                                                    .removeClass(activePositionClasses[1]);
                                            }
                                        }

                                        local.calendar
                                            .find(`.${activeClass}.${activePositionClasses[position]}`)
                                            .removeClass(activeClass)
                                            .removeClass(activePositionClasses[position]);
                                        $this.addClass(activeClass).addClass(activePositionClasses[position]);
                                        local.current[position] = moment(date);
                                    }

                                    if (local.current[0] && local.current[1]) {
                                        if (local.current[0].diff(local.current[1]) > 0) {
                                            const tmp = local.current[0];
                                            local.current[0] = local.current[1];
                                            local.current[1] = tmp;

                                            const $activeDateUnits = local.calendar.find(`.${activeClass}`);
                                            activePositionClasses.forEach(className =>
                                                $activeDateUnits.toggleClass(className));
                                        }

                                        if (
                                            !validDateArea(local.current[0], local.current[1]) &&
                                            !context.settings.selectOver
                                        ) {
                                            local.current[0] = null;
                                            local.current[1] = null;
                                            local.calendar
                                                .find(`.${activeClass}`)
                                                .removeClass(activeClass)
                                                .removeClass(activePositionClasses[0])
                                                .removeClass(activePositionClasses[1]);
                                        }

                                        if (local.input && !context.settings.buttons) {
                                            const dateValues = [];

                                            if (local.current[0] !== null)
                                                dateValues.push(local.current[0].format(context.settings.format));

                                            if (local.current[1] !== null)
                                                dateValues.push(local.current[1].format(context.settings.format));

                                            $this.val(dateValues.join(', '));
                                            $parent.trigger(`apply.${helper.getClass(models.name)}`);
                                        }
                                    }
                                }

                                if (context.settings.multiple) {
                                    local.calendar
                                        .find(`.${rangeClass}`)
                                        .removeClass(rangeClass)
                                        .removeClass(rangeFirstClass)
                                        .removeClass(rangeLastClass);
                                    generateDateRange.call();
                                }

                                if (context.settings.schedules.length)
                                    local.storage.schedules = context.settings.schedules.filter(event =>
                                        event.date === date);
                            }
                        }

                        const classifyDate = date => {
                            const partialDateGroup = validDate(moment(date))
                                ? local.date.enabled
                                : local.date.disabled;

                            local.date.all.push(date);
                            partialDateGroup.push(date);
                        };

                        if (local.current[0]) {
                            if (local.current[1]) {
                                const startDate = local.current[0];
                                const date = startDate.clone();

                                for (; date.format('YYYY-MM-DD') <= local.current[1].format('YYYY-MM-DD'); date.add('1', 'days')) {
                                    classifyDate(date.clone());
                                }
                            }
                            else
                                classifyDate(local.current[0].clone());
                        }

                        if (!preventSelect) {
                            local.initialize = null;

                            if (typeof context.settings.select === 'function')
                                context.settings.select.call($this, local.current, local);
                        }

                        if (typeof context.settings.click === 'function')
                            context.settings.click.call($this, event, local);
                    });
                }

                for (let i = lastWeekday + 1; $unitList.length < context.settings.weeks.length * 5; i++) {
                    if (i < 0)
                        i = global.languages.weeks.en.length - i;

                    const $unit = $(helper.format(
                        '<div class="{0} {0}-{1}"></div>',
                        helper.getSubClass('unit'),
                        global.languages.weeks.en[i % global.languages.weeks.en.length].toLowerCase())
                    );
                    $unitList.push($unit);
                }

                let $row = null;
                for (let i = 0; i < $unitList.length; i++) {
                    const element = $unitList[i];
                    if (i % context.settings.weeks.length === 0 || i + 1 >= $unitList.length) {
                        if ($row)
                            $row.appendTo($calendarBody);

                        if (i + 1 < $unitList.length)
                            $row = $(helper.format('<div class="{0}"></div>', helper.getSubClass('row')));
                    }
                    $row.append(element);
                }

                local.calendar
                    .find(`.${classNames.top}-nav`)
                    .bind('click', event => {
                        event.preventDefault();
                        event.stopPropagation();

                        const $this = $(event.currentTarget);
                        let type = 'unkown';

                        if ($this.hasClass(`${classNames.top}-prev`)) {
                            type = 'prev';
                            local.dateManager = new DateManager(local.dateManager.date.clone().add(-1, 'months'));
                        }
                        else if ($this.hasClass(`${classNames.top}-next`)) {
                            type = 'next';
                            local.dateManager = new DateManager(local.dateManager.date.clone().add(1, 'months'));
                        }

                        if (typeof context.settings.page === 'function')
                            context.settings.page.call($this, {
                                type: type,
                                year: local.dateManager.year,
                                month: local.dateManager.month,
                                day: local.dateManager.day
                            }, local);

                        if (typeof context.settings[type] === 'function')
                            context.settings[type].call($this, {
                                type: type,
                                year: local.dateManager.year,
                                month: local.dateManager.month,
                                day: local.dateManager.day
                            }, local);

                        local.renderer.call();
                    });

                if (context.settings.multiple) {
                    local.calendar
                        .find(`.${rangeClass}`)
                        .removeClass(rangeClass)
                        .removeClass(rangeFirstClass)
                        .removeClass(rangeLastClass);
                    generateDateRange.call();
                }
            };

            local.renderer.call();
            $this[0][models.name] = local;

            if (typeof context.settings.init === 'function')
                context.settings.init.call($this, local);
        });
    };
});
