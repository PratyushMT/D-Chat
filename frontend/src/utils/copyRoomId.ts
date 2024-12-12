export const copyRoomId = (
    roomId: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };