export interface IProps {
  name: string
  prefix?: string
  color?: string
  [key: string]: any
}

const SvgIcon = ({
  name,
  prefix = 'icon',
  color = '#333',
  ...props
}: IProps)  => {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  )
}

export default SvgIcon
