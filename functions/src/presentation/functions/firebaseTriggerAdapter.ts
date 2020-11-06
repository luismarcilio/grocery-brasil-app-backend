import { DatabaseTrigger } from "./DatabaseTrigger";

import * as functions from "firebase-functions";
import { CloudFunction, Change } from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export const firebaseTriggerAdapter = async <T>(
  path: string,
  trigger: DatabaseTrigger<T>
): Promise<CloudFunction<Change<DocumentSnapshot>>> => {
  return functions.firestore.document(path).onWrite(
    async (
      change: functions.Change<functions.firestore.DocumentSnapshot>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: functions.EventContext
    ) => {
      const document: T = <T>change.after.data();
      const documentAfterTrigger: T | null = await trigger.call(document);
      if (!documentAfterTrigger) {
        return null;
      }
      return change.after.ref.set(documentAfterTrigger);
    }
  );
};
