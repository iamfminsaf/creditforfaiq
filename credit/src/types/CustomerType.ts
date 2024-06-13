import { Key } from "react";

export interface CustomerType {
  cusname: String;
  profile: String;
  star: Boolean;
  balance: number;
  cusID: Key | undefined | null;
}
