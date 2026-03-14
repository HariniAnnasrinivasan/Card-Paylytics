import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import WeeklySpendChart from '../components/WeeklySpendChart';
import CategoryBreakdownChart from '../components/CategoryBreakdownChart';
import TopCategoriesChart from '../components/TopCategoriesChart';
import LargestTransactions from '../components/LargestTransactions';
import AiNudges from '../components/AiNudges';
import MerchantRecommendations from '../components/MerchantRecommendations';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Section 1: Header */}
                <ProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Section 2: Monthly Trend */}
                        <MonthlyTrendChart />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section 3: Weekly Spending */}
                            <WeeklySpendChart />
                            {/* Section 4: Category Breakdown */}
                            <CategoryBreakdownChart />
                        </div>

                        {/* Section 6: Largest Transactions */}
                        <LargestTransactions />
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        {/* Section 7: AI Nudges */}
                        <AiNudges />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <TopCategoriesChart />
                    <MerchantRecommendations />
                </div>
            </div>
        </div>
    );
}
