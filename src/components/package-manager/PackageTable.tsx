import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePackages } from "@/hooks/usePackages";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const PackageTable = () => {
  const { packages, isLoading, deletePackage } = usePackages();
  const { currency } = useUserPreferences();
  const navigate = useNavigate();

  const currencySymbols: Record<string, string> = {
    JPY: "¥",
    EUR: "€",
    USD: "$",
    GBP: "£",
  };

  const formatAmount = (amount: number) => {
    const exchangeRates: Record<string, number> = {
      JPY: 1,
      EUR: 0.0062,
      USD: 0.0067,
      GBP: 0.0053,
    };

    const convertedAmount = amount * exchangeRates[currency];
    const symbol = currencySymbols[currency];

    return `${symbol}${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    })}`;
  };

  const handleDelete = async (packageId: string) => {
    try {
      await deletePackage.mutateAsync(packageId);
      toast.success("Package supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du package");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Package Name</TableHead>
          <TableHead className="w-[150px]">Send Date</TableHead>
          <TableHead className="w-[150px]">Tracking</TableHead>
          <TableHead className="w-[200px] text-right">Total Amount ({currencySymbols[currency]})</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages?.map((pkg) => (
          <TableRow 
            key={pkg.id} 
            className="cursor-pointer hover:bg-muted/50"
            onClick={(e) => {
              // Prevent navigation when clicking delete button
              if ((e.target as HTMLElement).closest('.delete-button')) return;
              navigate(`/package-manager/${pkg.id}`);
            }}
          >
            <TableCell className="font-medium">{pkg.name}</TableCell>
            <TableCell>
              {pkg.send_date ? format(new Date(pkg.send_date), 'PPP') : 'Not set'}
            </TableCell>
            <TableCell>
              {pkg.tracking_number || <span className="text-muted-foreground">Not shipped yet</span>}
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(pkg.total_items_cost)}
            </TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="delete-button text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement le package et tous ses items associés.
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(pkg.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};