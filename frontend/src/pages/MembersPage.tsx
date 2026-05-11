import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";

type Member = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	pronoun: string;
	level: string;
	status: string;
	paymentStatus: string;
	joinedAt: string;
};

const statusColors: Record<string, string> = {
	ACTIVE: "bg-green-100 text-green-800",
	INACTIVE: "bg-gray-100 text-gray-800",
	PENDING: "bg-yellow-100 text-yellow-800",
	WAITLIST: "bg-blue-100 text-blue-800",
	TRYOUT: "bg-purple-100 text-purple-800",
};

const paymentColors: Record<string, string> = {
	PAID: "bg-green-100 text-green-800",
	UNPAID: "bg-red-100 text-red-800",
	OVERDUE: "bg-orange-100 text-orange-800",
	EXEMPT: "bg-gray-100 text-gray-800",
};

const columns: ColumnDef<Member>[] = [
	{
		id: "name",
		header: "Name",
		cell: ({ row }) => (
			<span className="font-medium">
				{row.original.firstName} {row.original.lastName}
				<span className="text-muted-foreground text-xs ml-1">
					{row.original.pronoun}
				</span>
			</span>
		),
	},
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "phone", header: "Phone" },
	{
		accessorKey: "level",
		header: "Level",
		cell: ({ getValue }) => (getValue() as string).toLowerCase(),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ getValue }) => {
			const value = getValue() as string;
			return (
				<span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[value]}`}>
					{value}
				</span>
			);
		},
	},
	{
		accessorKey: "paymentStatus",
		header: "Payment",
		cell: ({ getValue }) => {
			const value = getValue() as string;
			return (
				<span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[value]}`}>
					{value}
				</span>
			);
		},
	},
	{
		accessorKey: "joinedAt",
		header: "Joined",
		cell: ({ getValue }) =>
			new Date(getValue() as string).toLocaleDateString("en-NL"),
	},
];

const DEFAULT_LIMIT = 10;

export default function MembersPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const page = Number(searchParams.get("page") ?? 1);
	const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
	const search = searchParams.get("search") ?? "";
	const status = searchParams.get("status") ?? "";
	const level = searchParams.get("level") ?? "";
	const paymentStatus = searchParams.get("paymentStatus") ?? "";

	const [searchInput, setSearchInput] = useState(search);
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);

	// Debounce search input into URL
	useEffect(() => {
		const timer = setTimeout(() => {
			updateParams({ search: searchInput, page: "1" });
		}, 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	useEffect(() => {
		setLoading(true);
		const params: Record<string, string> = { page: String(page), limit: String(limit) };
		if (search) params.search = search;
		if (status) params.status = status;
		if (level) params.level = level;
		if (paymentStatus) params.paymentStatus = paymentStatus;

		api.get("/members", { params }).then((res) => {
			setMembers(res.data.data);
			setTotal(res.data.total);
			setTotalPages(res.data.totalPages);
			setLoading(false);
		});
	}, [page, limit, search, status, level, paymentStatus]);

	const updateParams = (updates: Record<string, string>) => {
		const next = new URLSearchParams(searchParams);
		for (const [key, value] of Object.entries(updates)) {
			if (value) next.set(key, value);
			else next.delete(key);
		}
		setSearchParams(next);
	};

	const table = useReactTable({
		data: members,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="px-6 py-8 space-y-6">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">{total} members</p>
				<Button onClick={() => navigate("/members/new")}>Add member</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<Input
					placeholder="Search name or email..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					className="w-56"
				/>
				<Select value={status} onValueChange={(v) => updateParams({ status: v === "ALL" ? "" : v, page: "1" })}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>
						<SelectItem value="ACTIVE">Active</SelectItem>
						<SelectItem value="INACTIVE">Inactive</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="WAITLIST">Waitlist</SelectItem>
						<SelectItem value="TRYOUT">Tryout</SelectItem>
					</SelectContent>
				</Select>
				<Select value={level} onValueChange={(v) => updateParams({ level: v === "ALL" ? "" : v, page: "1" })}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All levels</SelectItem>
						<SelectItem value="BEGINNER">Beginner</SelectItem>
						<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
						<SelectItem value="ADVANCED">Advanced</SelectItem>
					</SelectContent>
				</Select>
				<Select value={paymentStatus} onValueChange={(v) => updateParams({ paymentStatus: v === "ALL" ? "" : v, page: "1" })}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Payment" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All payments</SelectItem>
						<SelectItem value="PAID">Paid</SelectItem>
						<SelectItem value="UNPAID">Unpaid</SelectItem>
						<SelectItem value="OVERDUE">Overdue</SelectItem>
						<SelectItem value="EXEMPT">Exempt</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{loading ? (
				<p className="text-muted-foreground text-sm">Loading...</p>
			) : (
				<div className="rounded-lg border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="text-center text-muted-foreground py-8"
									>
										No members found
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => navigate(`/members/${row.original.id}`)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Page {page} of {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page === 1}
							onClick={() => updateParams({ page: String(page - 1) })}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page === totalPages}
							onClick={() => updateParams({ page: String(page + 1) })}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}