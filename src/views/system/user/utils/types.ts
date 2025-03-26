interface FormItemProps {
  userId?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  deptOptions?: Record<string, unknown>[];
  roleOptions?: Record<string, unknown>[];
  deptId: number;
  nickName: string;
  userName: string;
  password: string;
  phonenumber: string | number;
  email: string;
  sex: string | number;
  status: number;
  dept?: {
    deptId?: number;
    deptName?: string;
  };
  roleIds?: number[];
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  userName: string;
  nickName: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
