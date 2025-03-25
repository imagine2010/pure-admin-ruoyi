interface FormItemProps {
  jobName: string;
  jobGroup?: string;
  invokeTarget: string;
  cronExpression: string;
  status?: string;
  misfirePolicy?: string | number;
  concurrent?: string;
  jobId?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
