import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

const DEFAULT_LIMIT = 10;

export default function MembersPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get("page") ?? 1);
	const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setLoading(true);
		api.get("/members", { params: { page, limit } }).then((res) => {
			setMembers(res.data.data);
			setTotal(res.data.total);
			setTotalPages(res.data.totalPages);
			setLoading(false);
		});
	}, [page, limit]);

	return (
		<div className="px-6 py-8 space-y-6">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">{total} members</p>
				<Button onClick={() => navigate("/members/new")}>Add member</Button>
			</div>

				{/* Table */}
				{loading ? (
					<p className="text-muted-foreground text-sm">Loading...</p>
				) : (
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Level</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Payment</TableHead>
									<TableHead>Joined</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{members.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-muted-foreground py-8"
										>
											No members yet
										</TableCell>
									</TableRow>
								) : (
									members.map((member) => (
										<TableRow
											key={member.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() => navigate(`/members/${member.id}`)}
										>
											<TableCell className="font-medium">
												{member.firstName} {member.lastName}
												<span className="text-muted-foreground text-xs ml-1">
													{member.pronoun}
												</span>
											</TableCell>
											<TableCell>{member.email}</TableCell>
											<TableCell>{member.phone}</TableCell>
											<TableCell className="capitalize lowercase first-letter:uppercase">
												{member.level.toLowerCase()}
											</TableCell>
											<TableCell>
												<span
													className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[member.status]}`}
												>
													{member.status}
												</span>
											</TableCell>
											<TableCell>
												<span
													className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[member.paymentStatus]}`}
												>
													{member.paymentStatus}
												</span>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(member.joinedAt).toLocaleDateString("en-NL")}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Pagination */}
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
								onClick={() => setSearchParams({ page: String(page - 1), limit: String(limit) })}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={page === totalPages}
								onClick={() => setSearchParams({ page: String(page + 1), limit: String(limit) })}
							>
								Next
							</Button>
						</div>
					</div>
				)}
		</div>
	);
}
