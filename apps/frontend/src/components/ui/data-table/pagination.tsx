import { css } from "@shadow-panda/styled-system/css"
import { Box, Flex } from "@shadow-panda/styled-system/jsx"
import { icon } from "@shadow-panda/styled-system/recipes"
import type { Table } from "@tanstack/react-table"
import { Button } from "@ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <Flex align="center" justify="space-between" px="2">
      <Box color="muted.foreground" flex="1" textStyle="sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </Box>
      <Flex align="center" gap="6" lg={{ gap: "8" }}>
        <Flex align="center" gap="2">
          <p className={css({ textStyle: "sm", fontWeight: "medium" })}>
            Rows per page
          </p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            value={`${table.getState().pagination.pageSize}`}>
            <SelectTrigger h="8" w="70px">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Flex>
        <Flex
          align="center"
          fontWeight="medium"
          justify="center"
          textStyle="sm"
          w="100px">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Flex>
        <Flex align="center" gap="2">
          <Button
            disabled={!table.getCanPreviousPage()}
            display="none"
            h="8"
            lg={{ display: "flex" }}
            onClick={() => table.setPageIndex(0)}
            p="0"
            variant="outline"
            w="8">
            <span className={css({ srOnly: true })}>Go to first page</span>
            <ChevronsLeftIcon className={icon()} />
          </Button>
          <Button
            disabled={!table.getCanPreviousPage()}
            h="8"
            onClick={() => table.previousPage()}
            p="0"
            variant="outline"
            w="8">
            <span className={css({ srOnly: true })}>Go to previous page</span>
            <ChevronLeftIcon className={icon()} />
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            h="8"
            onClick={() => table.nextPage()}
            p="0"
            variant="outline"
            w="8">
            <span className={css({ srOnly: true })}>Go to next page</span>
            <ChevronRightIcon className={icon()} />
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            display="none"
            h="8"
            lg={{ display: "flex" }}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            p="0"
            variant="outline"
            w="8">
            <span className={css({ srOnly: true })}>Go to last page</span>
            <ChevronsRightIcon className={icon()} />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
