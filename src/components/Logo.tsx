import { Music } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl shadow-lg">
        <Music className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        SongScribe
      </h1>
    </div>
  );
}

export default Logo;
