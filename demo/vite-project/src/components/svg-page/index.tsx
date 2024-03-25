import SvgIcon from '../svg-icon';

const icons = import.meta.glob('@assets/svgs/svg-*.svg', { eager: true });

// const iconUrls = Object.values(icons).map((mod: any) => mod.default)
const iconUrls = Object.values(icons).map((mod: any) => {
  const fileName = mod.default.split('/').pop();
  const [svgName] = fileName.split('.');
  return svgName;
});

const SvgPage = () => {
  return (
    <div className="text-center mt-10">
      {iconUrls.map((icon) => (
        <SvgIcon name={icon} key={icon} className="w-20 h-20 ml-4" />
      ))}
    </div>
  );
};

export default SvgPage;
