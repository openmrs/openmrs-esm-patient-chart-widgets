import { Subject, Observable } from "rxjs";

const dialogBox = new Subject<DialogBoxItem>();

export function newDialogBox(item: DialogBoxItem) {
  dialogBox.next(item);
}

export function getDialogBox(): Observable<DialogBoxItem> {
  return dialogBox.asObservable();
}

export type DialogBoxItem = {
  component: Function;
  name: string;
  props: {};
};
