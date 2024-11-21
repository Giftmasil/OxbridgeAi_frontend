// JudgesHeader.jsx
import { Card, CardTitle } from "@/components/ui/card";
import PropTypes from 'prop-types';
import Navbar from "./Navbar";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <Card className="p-4 bg-[#242424] text-[#F8FAF7] border border-black">
      <CardTitle className="mb-4">{title}</CardTitle>
      <div className="flex items-center gap-2">
        <h3 className="text-4xl font-bold text-[#FFFFFF]">{value}</h3>
      </div>
      <p className="text-sm text-muted-foreground text-white">{subtitle}</p>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default function JudgesHeader({ activeTab }) {    
    return (
        <div className="text-white">
            <article>
                <Navbar />
            </article>
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        {activeTab === "dashboard" ? "Judge Dashboard" : activeTab === "scoring" ? "Scoring" : "Evaluation History"}
                    </h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard 
                        title="Assigned Startups"
                        value="24" 
                        subtitle="4 remaining today"
                    />
                    <StatCard 
                        title="Next Pitch"
                        value="8" 
                        subtitle="All assigned"
                    />
                    <StatCard
                        title="Todays schedule" 
                        value="12" 
                        subtitle="Next 24 hours"
                    />
                    <StatCard 
                        title="Completed Evaluations"
                        value="8" 
                        subtitle="2 Pending Review"
                    />
                </div>
            </div>
        </div>
    );
}

JudgesHeader.propTypes = {
    activeTab: PropTypes.string.isRequired,
};