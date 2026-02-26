import { defineStore } from "pinia";
import type { Board, Column, Task } from "~/lib/types/kanban";

export const useKanbanStore = defineStore("kanban", {
  state: () => ({
    boards: [] as Board[],
    activeBoardId: "ui-board",
  }),

  actions: {
    initUIBoard() {
      if (this.boards.length > 0) return;

      this.boards = [
        {
          id: "ui-board",
          name: "Any Board",
          columns: [
            { id: "todo", name: "Todo", tasks: [] },
            { id: "progress", name: "In Progress", tasks: [] },
            { id: "done", name: "Done", tasks: [] },
          ],
        },
      ];
    },

    getBoardColumns(boardId: string) {
      return this.boards.find(b => b.id === boardId)?.columns ?? [];
    },

    getColumnTasks(boardId: string, columnId: string) {
      return (
        this.getBoardColumns(boardId)
          .find(c => c.id === columnId)?.tasks ?? []
      );
    },

    createNewColumn(boardId: string, name: string) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;

      board.columns.push({
        id: crypto.randomUUID(),
        name,
        tasks: [],
      });
    },

    addTaskToColumn(
      boardId: string,
      columnId: string,
      task: Omit<Task, "id">
    ) {
      const column = this.getBoardColumns(boardId).find(c => c.id === columnId);
      if (!column) return;

      column.tasks.push({ ...task, id: crypto.randomUUID() });
    },

    editTask(
      boardId: string,
      fromColumnId: string,
      toColumnId: string,
      task: Task
    ) {
      const columns = this.getBoardColumns(boardId);
      const from = columns.find(c => c.id === fromColumnId);
      const to = columns.find(c => c.id === toColumnId);
      if (!from || !to) return;

      from.tasks = from.tasks.filter(t => t.id !== task.id);
      to.tasks.push(task);
    },
  },
});