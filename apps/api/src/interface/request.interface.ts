export interface RequestWithUser extends Request {
  user?: { email: string };
}
