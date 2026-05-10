import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MembersPage from "./pages/MembersPage";
import NewMemberPage from "./pages/NewMemberPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
	return (
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
	);
}

export default App;
