export const TEXTS = {
  title: {
    workLog: "Журнал работ",
  },
  form: {
    placeholder: {
      work: "Работа",
      volume: "Объём",
    },
    addButton: "Добавить",
    select: {
      unit: {
        value: "Единица",
      },
      worker: {
        value: "Исполнитель",
      },
    },
  },
  table: {
    empty: "Нет записей",
    date: "Дата",
    work: "Работа",
    volume: "Объём",
    unit: "Ед.",
    worker: "Исполнитель",
    action: "Действие",
    title: {
      delete: "Удалить",
      edit: "Редактировать",
    },
  },
  modal: {
    delete: {
      text: "Удалить запись из журнала?",
      confirm: "Да",
      cancel: "Нет",
    },
    edit: {
      text: "Редактировать запись в журнале",
      close: "Отмена",
      save: "Сохранить",
    },
  },

  pagination: {
    buttonBack: "Назад",
    buttonForward: "Вперед",
  },

  notification: {
    success: {
      added: "Запись добавлена",
      deleted: "Запись удалена",
      updated: "Запись обновлена",
    },
    error: {
      load: "Ошибка загрузки данных",
      loadReferences: "Ошибка загрузки справочников",
      create: "Ошибка при добавлении записи",
      update: "Ошибка при обновлении записи",
      delete: "Ошибка при удалении записи",
    },
  },

  validation: {
    volume: {
      message: "Объем работ должен быть числом",
      min: "Укажите объем работ",
      positive: "Объем работ должен быть больше 0",
      max: "Слишком длинное значение",
      maxValue: "Слишком большое значение",
      decimal: "Не более 2 знаков после точки",
    },
    unit: {
      min: "Выберите единицу",
    },
    workerName: {
      min: "Выберите исполнителя",
    },
    date: {
      min: "Укажите дату",
    },
    workType: {
      min: "Укажите тип работы",
      max: "Слишком длинное значение",
    },
  },
};
