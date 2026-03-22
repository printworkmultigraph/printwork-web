import { useLocation, Link } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-9xl font-bold text-navy-50/50">404</h1>
                        <div className="h-1 w-20 bg-navy-100 mx-auto -mt-6 relative z-10"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-navy-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Halaman Tidak Ditemukan
                        </h2>
                        <p className="text-navy-500 leading-relaxed">
                            Halaman <span className="font-bold text-navy-700">"{pageName || 'ini'}"</span> tidak dapat ditemukan atau sedang dalam pengembangan.
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-10">
                        <Link 
                            to="/Home" 
                            className="inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest uppercase text-white bg-navy-900 rounded-xl hover:bg-black transition-all duration-300 shadow-xl shadow-navy-900/10 group"
                        >
                            <svg className="w-4 h-4 mr-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
