"use client";

import React from "react";
import Link from "next/link";

export type Lead = {
	 id: string;
	 name: string;
	 email: string;
	 status: "New" | "Contacted" | "Qualified" | "Lost" | "Customer";
	 company?: string;
	 owner?: string;
	 linkedin?: string;
	 createdAt: string; // ISO date
};

type LeadsTableProps = {
	 leads: Lead[];
};

export default function LeadsTable({ leads }: LeadsTableProps) {
	 return (
		 <div className="w-full overflow-x-auto rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900">
			 <table className="w-full text-left text-sm">
				 <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-wider">
					 <tr>
						 <th className="px-4 py-3">Lead</th>
						 <th className="px-4 py-3">Company</th>
						 <th className="px-4 py-3">Owner</th>
						 <th className="px-4 py-3">LinkedIn</th>
						 <th className="px-4 py-3">Status</th>
						 <th className="px-4 py-3">Created</th>
					 </tr>
				 </thead>
				 <tbody>
					 {leads.map((lead) => (
						 <tr key={lead.id} className="border-t border-black/5 dark:border-white/10 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 cursor-pointer">
							 <td className="px-4 py-3">
								 <Link href={`/leads/${lead.id}`} className="block">
									 <div className="flex flex-col">
										 <span className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lead.name}</span>
										 <span className="text-neutral-500 dark:text-neutral-400 text-xs">{lead.email}</span>
									 </div>
								 </Link>
							 </td>
							 <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{lead.company ?? "-"}</td>
							 <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{lead.owner ?? "Unassigned"}</td>
							 <td className="px-4 py-3">
								 {lead.linkedin ? (
									 <a 
										 href={lead.linkedin} 
										 target="_blank" 
										 rel="noopener noreferrer"
										 className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
									 >
										 View Profile
									 </a>
								 ) : (
									 <span className="text-neutral-400 dark:text-neutral-500">-</span>
								 )}
							 </td>
							 <td className="px-4 py-3">
								 <span className={getStatusBadgeClasses(lead.status)}>{lead.status}</span>
							 </td>
							 <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{formatDate(lead.createdAt)}</td>
						 </tr>
					 ))}
				 </tbody>
			 </table>
		 </div>
	 );
}

function formatDate(isoDate: string): string {
	 const date = new Date(isoDate);
	 return date.toLocaleDateString(undefined, {
		 year: "numeric",
		 month: "short",
		 day: "numeric",
	 });
}

function getStatusBadgeClasses(status: Lead["status"]): string {
	 const base =
		 "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
	 switch (status) {
		 case "New":
			 return `${base} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900`;
		 case "Contacted":
			 return `${base} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900`;
		 case "Qualified":
			 return `${base} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900`;
		 case "Customer":
			 return `${base} bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900`;
		 case "Lost":
		 default:
			 return `${base} bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900`;
	 }
}


