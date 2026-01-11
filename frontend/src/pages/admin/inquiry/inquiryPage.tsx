import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllInquiries } from "@/features/inquiryApi";
import { Trash2, Edit, Search } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

const InquiryPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllInquiries();
  const inquiries = data?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter inquiries by search term & date
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const createdAt = new Date(inq.createdAt);
    const afterStart = startDate ? createdAt >= new Date(startDate) : true;
    const beforeEnd = endDate ? createdAt <= new Date(endDate) : true;

    return matchesSearch && afterStart && beforeEnd;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Inquiries</h1>
          <p className="text-gray-600">
            Total Inquiries: {inquiries.length}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or destination"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Inquiry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInquiries.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No inquiries found
          </p>
        )}

        {filteredInquiries.map((inq) => (
          <Card
            key={inq._id}
            className="bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition"
          >
            <CardHeader className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {inq.fullName}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-400 hover:bg-blue-50">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-400 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold text-gray-700">Email:</span> {inq.email}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Phone:</span> {inq.phone}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Destination:</span> {inq.destination}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Message:</span> {inq.message}
              </p>
              <p className="text-sm text-gray-400">
                Submitted: {new Date(inq.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InquiryPage;
