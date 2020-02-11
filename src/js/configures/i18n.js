define([], () => {
  return {
    defaultLanguage: 'en',
    supports: ['ar', 'en', 'ko', 'fr', 'ch', 'de', 'nl', 'jp', 'pt', 'da', 'pl', 'es', 'cs', 'uk', 'ru', 'ka', 'ca', 'oc'],
    weeks: {
      ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ko: ['일', '월', '화', '수', '목', '금', '토'],
      fa: ['شنبه', 'آدینه', 'پنج', 'چهار', 'سه', 'دو', 'یک'],
      fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      ch: ['日', '一', '二', '三', '四', '五', '六'],
      de: ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'],
      nl: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
      jp: ['日', '月', '火', '水', '木', '金', '土'],
      pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
      pl: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
      es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
      cs: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
      uk: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      ka: ['კვ', 'ორ', 'სმ', 'ოთ', 'ხთ', 'პრ', 'შბ'],
      ca: ['Dg', 'Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds'],
      oc: ['Dg', 'Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds']
    },
    monthsLong: {
      ar: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
      ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
      fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      nl: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
      jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
      pl: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
      es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      cs: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Cervenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
      uk: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
      ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      ka: ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'],
      ca: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
      oc: ['Genièr', 'Febrièr', 'Març', 'Abril', 'Mai', 'Junh', 'Julhet', 'Agost', 'Setembre', 'Octòbre', 'Novembre', 'Decembre']
    },
    months: {
      ar: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
      fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      nl: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
      jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      da: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
      pl: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
      es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
      it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
      uk: ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'],
      ru: ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
      ka: ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'],
      ca: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
      ca: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Junh', 'Julh', 'Ago', 'Set', 'Oct', 'Nov', 'Dec']
    },
    },
    controls: {
      ar: {
        ok: 'حسناً',
        cancel: 'إلغاء'
      },
      en: {
        ok: 'OK',
        cancel: 'Cancel'
      },
      ko: {
        ok: '확인',
        cancel: '취소'
      },
      fa: {
        ok: 'چک کنید',
        cancel: 'لغو'
      },
      fr: {
        ok: 'Vérifier',
        cancel: 'Annuler'
      },
      ch: {
        ok: '确认',
        cancel: '取消'
      },
      de: {
        ok: 'Okay',
        cancel: 'Abbrechen'
      },
      nl: {
        ok: 'Oké',
        cancel: 'Annuleren'
      },
      jp: {
        ok: '確認',
        cancel: 'キャンセル'
      },
      pt: {
        ok: 'Verifique',
        cancel: 'Cancelar'
      },
      da: {
        ok: 'Bekræftelse',
        cancel: 'aflyst'
      },
      pl: {
        ok: 'Sprawdź',
        cancel: 'Anuluj'
      },
      es: {
        ok: 'Cheque',
        cancel: 'Cancelar'
      },
      it: {
        ok: 'conferma',
        cancel: 'annullato'
      },
      cs: {
        ok: 'Zkontrolujte',
        cancel: 'Zrušit'
      },
      uk: {
        ok: 'Вибрати',
        cancel: 'Скасувати'
      },
      ru: {
        ok: 'Выбрать',
        cancel: 'Отмена'
      },
      ka: {
        ok: 'არჩევა',
        cancel: 'გაუქმება'
      },
      ca: {
        ok: 'Confirmar',
        cancel: 'Cancel·lar'
      },
      oc: {
        ok: 'Confirmar',
        cancel: 'Anullar'
      }

    }
  };
});
