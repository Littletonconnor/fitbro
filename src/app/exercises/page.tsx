'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Button } from '@/components/button'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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

export default function ExercisesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Exercises</h1>
      </div>

      <ExercisesTable />
    </div>
  )
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    date: '2023-07-12',
    exercise: 'Squat',
    reps: 5,
    lbs: 15,
  },
  {
    id: '3u1reuv4',
    date: '2023-07-13',
    exercise: 'Bench Press',
    reps: 5,
    lbs: 15,
  },
  {
    id: 'derv1ws0',
    date: '2023-07-14',
    exercise: 'Deadlift',
    reps: 5,
    lbs: 15,
  },
  {
    id: '5kma53ae',
    date: '2023-07-15',
    exercise: 'Pull Ups',
    reps: 5,
    lbs: 15,
  },
  {
    id: 'm5gr84i9',
    date: '2023-07-16',
    exercise: 'Squat',
    reps: 5,
    lbs: 20,
  },
]

export interface Payment {
  id: string
  date: string
  exercise: string
  reps: number
  lbs: number
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig

export function ExercisesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const columns: ColumnDef<Payment>[] = React.useMemo(
    () => [
      {
        accessorKey: 'exercise',
        header: () => <div className="text-left">Exercise</div>,
        cell: ({ row }) => <div className="capitalize font-medium">{row.getValue('exercise')}</div>,
      },
      {
        accessorKey: 'date',
        header: () => <div className="text-right">Date</div>,
        cell: ({ row }) => {
          return <div className="text-right">{row.getValue('date')}</div>
        },
      },
      {
        accessorKey: 'reps',
        header: () => <div className="text-right">Reps</div>,
        cell: ({ row }) => {
          return <div className="text-right">{row.getValue('reps')}</div>
        },
      },
      {
        accessorKey: 'lbs',
        header: () => <div className="text-right">Lbs</div>,
        cell: ({ row }) => {
          return <div className="text-right">{row.getValue('lbs')}</div>
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: () => {
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
                  <DropdownMenuItem onClick={() => setOpen(true)}>View details</DropdownMenuItem>
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
    data,
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
    <div className="w-full max-w-screen-2xl">
      <form className="flex items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises"
            value={(table.getColumn('exercise')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('exercise')?.setFilterValue(event.target.value)}
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
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-xl max-h-[calc(100%-80px)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Squat</DialogTitle>
              <DialogDescription>Squat progression over time</DialogDescription>
            </DialogHeader>
            <h3 className="text-md font-semibold">Weight</h3>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
            <h3 className="text-md font-semibold">One Rep Max</h3>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
            <h3 className="text-md font-semibold">Set Volume</h3>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[calc(100%-80px)]">
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DrawerDescription>
            </DrawerHeader>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
            <h3 className="text-md font-semibold">One Rep Max</h3>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
            <h3 className="text-md font-semibold">Set Volume</h3>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

function ProfileForm({ className }: React.ComponentProps<'form'>) {
  return (
    <form className={cn('grid items-start gap-4', className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}
