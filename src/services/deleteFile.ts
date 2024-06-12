import type { AxiosError, AxiosResponse } from "axios";
import AxiosInstance from "src/configs/axios";
import adminEndpoint from "src/configs/endpoints/admin";

export interface DeleteResponse {
  messages?: string;
}

export const deleteFile = async (fileUrl: string): Promise<any> => {
  try {
    const response: AxiosResponse<string> = await AxiosInstance.delete(
      `${adminEndpoint.deleteFileEndpoint}`,
      { data: { image: fileUrl } },
    );
    console.log(response.data)

    return { messages: response.data }

  } catch (error) {
    const err = error as AxiosError<any>;

    throw new Error(err.response?.data.message || 'Unknown error occurred');
  }
}

