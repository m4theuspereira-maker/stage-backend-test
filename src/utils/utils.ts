
export const INVALID_OBJECTID = "Invalid objectId"

export class Validators {
  isValidObjectId = (objectId: string) =>
    /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(objectId);
}
