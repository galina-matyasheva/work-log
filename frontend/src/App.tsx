import "./App.css";

import { LogApi } from "api/LogApi";
import { UnitsApi } from "api/UnitsApi";
import { WorkersApi } from "api/WorkersApi";
import { Loader } from "components/common/loader/Loader";
import { Notification } from "components/common/notification/Notification";
import { LogForm } from "components/logForm/LogForm";
import { LogTable } from "components/logTable/LogTable";
import { TEXTS } from "constants/texts";
import { useCallback, useEffect, useState } from "react";
import { FcViewDetails } from "react-icons/fc";
import { LogFormData, LogItem } from "types/log";
import { Unit } from "types/unit";
import { Worker } from "types/worker";

type NotificationState = {
  type: "success" | "error";
  message: string;
};

function App() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [resetFormErrorsKey, setResetFormErrorsKey] = useState(0);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await LogApi.getAll();
      setItems(data);
    } catch {
      setNotification({ type: "error", message: TEXTS.notification.error.load });
    }
  }, []);

  const loadReferences = useCallback(async () => {
    try {
      const [workersData, unitsData] = await Promise.all([
        WorkersApi.getAll(),
        UnitsApi.getAll(),
      ]);
      setWorkers(workersData);
      setUnits(unitsData);
    } catch {
      setNotification({ type: "error", message: TEXTS.notification.error.loadReferences });
    }
  }, []);

  useEffect(() => {
    Promise.all([load(), loadReferences()]).finally(() => {
      setIsInitialLoading(false);
    });
  }, [load, loadReferences]);

  const deleteItem = async (id: number) => {
    try {
      await LogApi.remove(id);
      setNotification({
        type: "success",
        message: TEXTS.notification.success.deleted,
      });
      load();
    } catch {
      setNotification({
        type: "error",
        message: TEXTS.notification.error.delete,
      });
    }
  };

  const resetFormErrors = () => {
    setResetFormErrorsKey((prev) => prev + 1);
  };

  const addItem = async (data: LogFormData) => {
    try {
      await LogApi.create(data);
      setNotification({
        type: "success",
        message: TEXTS.notification.success.added,
      });
      load();
    } catch {
      setNotification({
        type: "error",
        message: TEXTS.notification.error.create,
      });
    }
  };

  const handleError = (message: string) => {
    setNotification({ type: "error", message });
  };

  const handleSuccess = (message: string) => {
    setNotification({ type: "success", message });
  };

  if (isInitialLoading) {
    return (
      <div className="container">
        <h1 className="container-header">
          <FcViewDetails /> {TEXTS.title.workLog}
        </h1>
        <Loader height={300} />
      </div>
    );
  }

  return (
    <div className="container">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <h1 className="container-header">
        <FcViewDetails /> {TEXTS.title.workLog}
      </h1>
      <div className="content-wrapper">
        <div className="content-inner">
          <LogForm
            onAdd={addItem}
            resetErrorsKey={resetFormErrorsKey}
            workers={workers}
            units={units}
          />
          <LogTable
            resetFormErrors={resetFormErrors}
            items={items}
            onDelete={deleteItem}
            reload={load}
            onError={handleError}
            onSuccess={handleSuccess}
            workers={workers}
            units={units}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
