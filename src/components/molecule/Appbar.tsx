import { CurrentDateTime } from "../atoms";

const Appbar = () => {
  return (
    <div className="shadow w-full flex items-center justify-between p-2 bg-background/80">
      <p className="text-xl font-semibold">User Details</p>
      <p className="text-sm text-muted-foreground">
        <CurrentDateTime />
      </p>
    </div>
  );
};

export default Appbar;
