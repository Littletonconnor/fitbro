'use client'

import React from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Input } from '@/components/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { ExerciseWithSets } from '@/db/schema'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

export interface Payment {
  id: string
  date: string
  exercise: string
  reps: number
  lbs: number
}

export interface Props {
  exercises: ExerciseWithSets[]
}

// TODO: move data fetching into here instead of passing in exercises.
// TODO: also sort by date

export function ExercisesTable({ exercises }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const normalizedExercises = React.useMemo(() => {
    return exercises.map((exercise) => {
      return {
        ...exercise,
        setOne: exercise.sets[0] && `${exercise.sets[0].weight}/${exercise.sets[0].reps}`,
        setTwo: exercise.sets[1] && `${exercise.sets[1].weight}/${exercise.sets[1].reps}`,
        setThree: exercise.sets[2] && `${exercise.sets[2].weight}/${exercise.sets[2].reps}`,
        setFour: exercise.sets[3] && `${exercise.sets[3].weight}/${exercise.sets[3].reps}`,
      }
    })
  }, [exercises])

  const setColumns: ColumnDef<(typeof normalizedExercises)[0]>[] = React.useMemo(
    () => [
      {
        accessorKey: 'setOne',
        header: () => <div className="text-right">Set 1</div>,
        cell: ({ row }) => {
          return <div className="capitalize font-medium text-right">{row.getValue('setOne')}</div>
        },
      },
      {
        accessorKey: 'setTwo',
        header: () => <div className="text-right">Set 2</div>,
        cell: ({ row }) => {
          return <div className="capitalize font-medium text-right">{row.getValue('setTwo')}</div>
        },
      },
      {
        accessorKey: 'setThree',
        header: () => <div className="text-right">Set 3</div>,
        cell: ({ row }) => {
          return <div className="capitalize font-medium text-right">{row.getValue('setThree')}</div>
        },
      },
      {
        accessorKey: 'setFour',
        header: () => <div className="text-right">Set 4</div>,
        cell: ({ row }) => {
          return (
            <div className="capitalize font-medium text-right">
              {row.getValue('setFour') ?? 'N/A'}
            </div>
          )
        },
      },
    ],
    [],
  )

  const columns: ColumnDef<(typeof normalizedExercises)[0]>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => <div className="text-left">Exercise</div>,
        cell: ({ row }) => <div className="capitalize font-medium">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'createdAt',
        header: () => <div className="text-right">Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right">
              {new Date(row.getValue('createdAt')).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          )
        },
      },
      ...setColumns,
      {
        id: 'actions',
        enableHiding: false,
        size: 100,
        cell: ({ row }) => {
          return (
            <div className="w-full text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/exercises/${row.original.id}`}>View details</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: normalizedExercises,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full max-w-5xl">
      <form className="flex items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-72"
          />
        </div>
      </form>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
