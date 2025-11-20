
import UserTable from '@/components/UserTable';

export default function Page() {
    return (
        <div className="flex flex-row min-h-screen">
            <main className="flex-1 p-6 lg:p-8 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý Người dùng</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                                Xem, thêm, chỉnh sửa và quản lý tất cả người dùng trong hệ thống.
                            </p>
                        </div>
                    </div>
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email..."
                            className="form-input w-full rounded-lg px-4 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                        />
                        <button className="flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95 min-w-[150px]">
                            <span className="material-symbols-outlined text-base"></span>
                            <span className="truncate">Thêm người dùng</span>
                        </button>
                    </div>

                    <UserTable />
                </div>
            </main>
        </div>
    );
}
