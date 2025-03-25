interface FormItemProps {
  dictName: string;
  dictType: string;
  dictId?: string;
  remark?: string;
  status: string;
  createTime?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
