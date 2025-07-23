import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBoards, createBoard, deleteBoard } from '../utils/api';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newBoard, setNewBoard] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const data = await getBoards();
    setBoards(data);
  };

  const handleCreateBoard = async () => {
    if (!newBoard.trim()) return;
    const created = await createBoard(newBoard.trim());
    setBoards([...boards, created]);
    setNewBoard('');
    setShowInput(false);
  };

  return (
    <div>
      <h2 className="text-lg mb-4">YOUR WORKSPACES</h2>
      <div className="boardlist">
        {boards.map(board => (
          <div className="board" key={board.id}>
  <Link to={`/board/${board.id}`}>{board.name}</Link>
  <button
    onClick={async () => {
      await deleteBoard(board.id);
      setBoards(boards.filter(b => b.id !== board.id));
    }}
    style={{ marginLeft: '10px', color: 'red' }}
  >
    🗑
  </button>
</div>
        ))}

        <div className="create-board">
          {showInput ? (
            <div>
              <input
                type="text"
                placeholder="Enter board name"
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
                autoFocus
              />
              <button onClick={handleCreateBoard}>Create</button>
              <div onClick={() => setShowInput(false)}>Cancel</div>
            </div>
          ) : (
            <div onClick={() => setShowInput(true)}>+ Create Board</div>
          )}
        </div>
      </div>
      
    </div>
  );
}
