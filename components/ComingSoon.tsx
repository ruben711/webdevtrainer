import { Icon, type IconName } from "@/components/Icon";

export function ComingSoon({
  title,
  icon = "beaker",
  children,
}: {
  title: string;
  icon?: IconName;
  children?: React.ReactNode;
}) {
  return (
    <div className="page page-anim">
      <div className="soon">
        <div className="soon-mark">
          <Icon name={icon} size={28} />
        </div>
        <h2>{title}</h2>
        <p>{children ?? "Dit onderdeel komt binnenkort. De architectuur staat klaar — deze module wordt in een volgende stap gebouwd."}</p>
      </div>
    </div>
  );
}
