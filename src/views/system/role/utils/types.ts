interface FormItemProps {
  roleName: string;
  roleId?: string;
  remark?: string;
  roleKey: string; // 权限字符
  status: string;
  menuCheckStrictly?: boolean;
  menuIds?: string[];
  roleSort: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
