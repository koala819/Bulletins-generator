'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  matricule: z.string(),
  promotion: z.string(),
  annee: z.string(),
  formation: z.string(),
  categorie: z.string(),
  session: z.string(),
});

const BulletinScolaire = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricule: "",
      promotion: "TRP 15",
      annee: "2023/2024",
      formation: "TMA",
      categorie: "TRP",
      session: "1ère Phase du 04/09/2023 au 31/12/2023",
    },
  });

  const generalScientifiqueData = [
    { matiere: "Anglais", module: "18", moyenne: "E", classMoy: "F", classement: "E24 (4ème du bas)", appreciation: "G" },
    { matiere: "Technologie Professionnelle", module: "6-7", moyenne: "N", classMoy: "O", classement: "N24 (4ème du bas)", appreciation: "P" },
    { matiere: "Système électriques / Instrument de Bord", module: "11", moyenne: "T", classMoy: "U", classement: "T24 (4ème du bas)", appreciation: "V" },
    { matiere: "Aérodynamique", module: "ér", moyenne: "Y", classMoy: "Z", classement: "Y24 (4ème du bas)", appreciation: "AA" },
    { matiere: "Thermodynamique / Thermopropulsion", module: "ér", moyenne: "Y", classMoy: "Z", classement: "Y24 (4ème du bas)", appreciation: "AA" },
    { matiere: "Théorie avion et systèmes", module: "11", moyenne: "AF", classMoy: "AG", classement: "AF24 (4ème du bas)", appreciation: "AE" },
    { matiere: "Thermopropulsion et Technique GTR", module: "15-17", moyenne: "AM", classMoy: "AN", classement: "AM24 (4ème du bas)", appreciation: "A0" },
    
  ];

  const enseignementPratiqueData = [
    { matiere: "TPBMC", module: "7", moyenne: "AY", classMoy: "AZ", classement: "AY24 (4ème du bas)", appreciation: "BA" },
    { matiere: "TPCVR", module: "7", moyenne: "BG", classMoy: "BH", classement: "BG24 (4ème du bas)", appreciation: "BI" },
    { matiere: "TPBCE", module: "7", moyenne: "BL", classMoy: "BM", classement: "BL24 (4ème du bas)", appreciation: "BN" },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulletin Scolaire - Technicien de Maintenance Aéronautique</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Ajoutez les autres champs du formulaire ici */}
            </div>
          </Form>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">I. Enseignement Général et Scientifique</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matières</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Moy. Class</TableHead>
                  <TableHead>Classement</TableHead>
                  <TableHead>Appréciations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generalScientifiqueData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.matiere}</TableCell>
                    <TableCell>{item.module}</TableCell>
                    <TableCell>{item.moyenne}</TableCell>
                    <TableCell>{item.classMoy}</TableCell>
                    <TableCell>{item.classement}</TableCell>
                    <TableCell>{item.appreciation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">II. Enseignement Pratique</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matières</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Moy. Class</TableHead>
                  <TableHead>Classement</TableHead>
                  <TableHead>Appréciations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enseignementPratiqueData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.matiere}</TableCell>
                    <TableCell>{item.module}</TableCell>
                    <TableCell>{item.moyenne}</TableCell>
                    <TableCell>{item.classMoy}</TableCell>
                    <TableCell>{item.classement}</TableCell>
                    <TableCell>{item.appreciation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Ajoutez ici les sections pour la moyenne générale, le bilan disciplinaire et l'appréciation générale */}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulletinScolaire;