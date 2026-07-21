/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PendingLoginData {
  name: string;
  avatarId: number;
  googleProfile?: {
    id: string;
    name: string;
    email: string;
    picture: string;
  };
}
