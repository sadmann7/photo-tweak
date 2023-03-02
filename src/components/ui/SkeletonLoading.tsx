import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoading = ({ borderRadius = 6 }: { borderRadius?: number }) => {
  return (
    <Skeleton
      baseColor="#3b3b3b"
      highlightColor="#626262"
      borderRadius={borderRadius}
      className="h-full w-full"
    />
  );
};

export default SkeletonLoading;
