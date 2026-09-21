"use client";

import {
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export default function AdminTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  rowKey,
  pagination,
  onPageChange,
}) {
  function getRowKey(row, index) {
    if (typeof rowKey === "function") {
      return rowKey(row, index);
    }

    if (rowKey) {
      return row[rowKey];
    }

    return (
      row?._id ||
      row?.id ||
      index
    );
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="min-h-[240px] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map(
                (column) => (
                  <th
                    key={
                      column.key ||
                      column.header
                    }
                    className={`px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 ${
                      column.className || ""
                    }`}
                  >
                    {column.header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    Math.max(
                      columns.length,
                      1
                    )
                  }
                  className="px-5 py-14"
                >
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Inbox
                        size={25}
                        className="text-gray-400"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-gray-700">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map(
                (row, rowIndex) => (
                  <tr
                    key={getRowKey(
                      row,
                      rowIndex
                    )}
                    className="transition hover:bg-gray-50"
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.key ||
                            column.header
                          }
                          className={`px-5 py-4 text-sm text-gray-700 ${
                            column.cellClassName ||
                            ""
                          }`}
                        >
                          {typeof column.render ===
                          "function"
                            ? column.render(
                                row,
                                rowIndex
                              )
                            : column.key
                            ? row[
                                column.key
                              ]
                            : null}
                        </td>
                      )
                    )}
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {pagination &&
        pagination.totalPages >
          1 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  pagination.page <=
                  1
                }
                onClick={() =>
                  onPageChange?.(
                    pagination.page -
                      1
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={16}
                />

                Previous
              </button>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  onPageChange?.(
                    pagination.page +
                      1
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight
                  size={16}
                />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}