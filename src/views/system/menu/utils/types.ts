interface FormItemProps {
  menuType: string;
  menuId: number;
  children?: Record<string, unknown>[];
  higherMenuOptions?: Record<string, unknown>[];
  parentId: number;
  parentName: string;
  menuName: string;
  path: string;
  component: string;
  orderNum: number;
  icon: string;
  activePath?: string;
  perms?: string;
  query?: string;
  isFrame?: string;
  isCache?: string;
  routeName?: string;
  status: string;
  visible: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
