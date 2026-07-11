import { Analytics } from "@vercel/analytics/react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import MembersPage from "./pages/MembersPage";
import NewMemberPage from "./pages/NewMemberPage";

function App() {
	return (
		<>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					element={
						<ProtectedRoute>
							<AppLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/members" element={<MembersPage />} />
					<Route path="/members/new" element={<NewMemberPage />} />
					<Route path="/members/:id" element={<MemberDetailPage />} />
				</Route>
				<Route path="*" element={<Navigate to="/members" />} />
			</Routes>
			<Analytics />
		</>
	);
}

export default App;
