type Props = {
  deleteFormItem: () => void;
};
export default function DeleteModal({ deleteFormItem }: Props) {
  return (
    <div
      id="deleteModal"
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
    >
      <div className="max-w-md bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Delete</h2>
        <p className="mb-4">
          Can you confirm you want to delete the selected element?
        </p>
        <div className="flex justify-center">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
            onClick={deleteFormItem}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
            onClick={() => {
              document.getElementById("deleteModal")!.classList.add("hidden");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
