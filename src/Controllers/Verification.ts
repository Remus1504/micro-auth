import {
  getAuthUserById,
  getAuthUserByVerificationToken,
  updateVerifyEmailField,
} from '../Helper/Authentication';
import { BadRequestError, IAuthDocument } from '@remus1504/micrograde';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function update(req: Request, res: Response): Promise<void> {
  const { token } = req.body;
  const checkIfUserExist: IAuthDocument | undefined =
    await getAuthUserByVerificationToken(token);
  if (!checkIfUserExist) {
    throw new BadRequestError(
      'Verification token is either invalid or is already used.',
      'VerifyEmail update() method error',
    );
  }
  await updateVerifyEmailField(checkIfUserExist.id!, 1);
  const updatedUser = await getAuthUserById(checkIfUserExist.id!);
  res
    .status(StatusCodes.OK)
    .json({ message: 'Email verified successfully.', user: updatedUser });
}