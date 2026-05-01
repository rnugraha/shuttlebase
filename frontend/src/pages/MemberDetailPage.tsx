import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

type Member = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	pronoun: string;
	dob: string;
	address: string;
	level: string;
	status: string;
	paymentStatus: string;
	paidAt: string | null;
	joinedAt: string;
};

export default function MemberDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [form, setForm] = useState<Partial<Member>>({});

	useEffect(() => {
		api.get(`/members/${id}`).then((res) => {
			const m = res.data;
			setForm({
				...m,
				dob: m.dob ? m.dob.split("T")[0] : "",
				paidAt: m.paidAt ? m.paidAt.split("T")[0] : "",
			});
			setLoading(false);
		});
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		setSuccess(false);

		try {
			await api.patch(`/members/${id}`, form);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (err: any) {
			const errors = err.response?.data?.errors;
			if (errors) {
				const first = Object.values(errors)[0] as string[];
				setError(first[0]);
			} else {
				setError(err.response?.data?.message || "Failed to update member");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleDeactivate = async () => {
		if (!confirm("Deactivate this member?")) return;
		await api.delete(`/members/${id}`);
		navigate("/members");
	};

	if (loading)
		return <div className="p-8 text-muted-foreground">Loading...</div>;

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="outline" onClick={() => navigate("/members")}>
							← Back
						</Button>
						<h1 className="text-2xl font-bold tracking-tight">
							{form.firstName} {form.lastName}
						</h1>
					</div>
					<Button variant="destructive" onClick={handleDeactivate}>
						Deactivate
					</Button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First name</Label>
							<Input
								id="firstName"
								name="firstName"
								value={form.firstName || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last name</Label>
							<Input
								id="lastName"
								name="lastName"
								value={form.lastName || ""}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={form.email || ""}
							onChange={handleChange}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input
								id="phone"
								name="phone"
								value={form.phone || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="pronoun">Pronoun</Label>
							<Input
								id="pronoun"
								name="pronoun"
								value={form.pronoun || ""}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="dob">Date of birth</Label>
							<Input
								id="dob"
								name="dob"
								type="date"
								value={form.dob || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="level">Level</Label>
							<Select
								value={form.level}
								onValueChange={(value) => setForm({ ...form, level: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="BEGINNER">Beginner</SelectItem>
									<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
									<SelectItem value="ADVANCED">Advanced</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							name="address"
							value={form.address || ""}
							onChange={handleChange}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={form.status}
								onValueChange={(value) => setForm({ ...form, status: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ACTIVE">Active</SelectItem>
									<SelectItem value="INACTIVE">Inactive</SelectItem>
									<SelectItem value="PENDING">Pending</SelectItem>
									<SelectItem value="WAITLIST">Waitlist</SelectItem>
									<SelectItem value="TRYOUT">Tryout</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="paymentStatus">Payment status</Label>
							<Select
								value={form.paymentStatus}
								onValueChange={(value) =>
									setForm({ ...form, paymentStatus: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="PAID">Paid</SelectItem>
									<SelectItem value="UNPAID">Unpaid</SelectItem>
									<SelectItem value="OVERDUE">Overdue</SelectItem>
									<SelectItem value="EXEMPT">Exempt</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="paidAt">Last payment date</Label>
						<Input
							id="paidAt"
							name="paidAt"
							type="date"
							value={form.paidAt || ""}
							onChange={handleChange}
						/>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}
					{success && (
						<p className="text-sm text-green-600">Saved successfully!</p>
					)}

					<div className="flex gap-2 pt-2">
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save changes"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/members")}
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
