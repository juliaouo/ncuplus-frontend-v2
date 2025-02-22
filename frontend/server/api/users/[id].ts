import { APIUser } from "types/APIUser";
import { APIResponse } from "types/APIResponse";

export default defineEventHandler(async (event): Promise<APIUser> => {
  const config = useRuntimeConfig();
  const { data: user } = await $fetch<APIResponse<APIUser>>(
    `${config.public.apiBaseUrl}/users/${event.context.params.id}`,
  );
  if (!user) throw new Error(`Can't get user infomation`);
  return user;
});
