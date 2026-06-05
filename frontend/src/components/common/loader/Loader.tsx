import "./Loader.css";

type Props = {
  size?: number;
  height?: number;
};

export const Loader = ({ size = 40, height = 285 }: Props) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container" style={{ minHeight: height }}>
        <div className="spinner" data-testid="spinner" style={{ width: size, height: size }} />
      </div>
    </div>
  );
};
