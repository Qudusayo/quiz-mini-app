import Button from "./button";

interface EndGameModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function EndGameModal({ onConfirm, onCancel }: EndGameModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-[400px] w-11/12 mx-4">
        <h2 className="text-white text-xl font-semibold mb-4">End Game</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to end the game? Your current score will be
          saved.
        </p>
        <div className="flex relative">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-4 py-2 rounded-lg transition-colors flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="px-4 py-2 rounded-lg transition-colors flex-1"
          >
            End Game
          </Button>
        </div>
      </div>
    </div>
  );
}
