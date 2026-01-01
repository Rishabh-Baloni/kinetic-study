import CornerElements from "./CornerElements";

interface ProfileHeaderProps {
  name: string;
  image?: string;
}

const ProfileHeader = ({ name, image }: ProfileHeaderProps) => {
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border p-6">
      <CornerElements />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {image ? (
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {name?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background"></div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-foreground">{name}</span>
            </h1>
            <div className="flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
              <p className="text-xs font-mono text-primary">ACTIVE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
