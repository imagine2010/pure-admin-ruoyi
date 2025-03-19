interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parentId?: string;
  deptId?: string;
  deptName: string;
  orderNum: number;
  leader?: string;
  phone?: string | number;
  ancestors?: string;
  email?: string;
  status: string;
  remark?: string;
  type?: string;
  children?: Record<string, unknown>[];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
