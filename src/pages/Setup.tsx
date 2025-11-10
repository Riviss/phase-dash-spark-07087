import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSourcesTab from "@/components/setup/DataSourcesTab";
import AreasTab from "@/components/setup/AreasTab";
import AlgorithmsTab from "@/components/setup/AlgorithmsTab";
import PipelinesTab from "@/components/setup/PipelinesTab";

const Setup = () => {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">Setup & Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Configure data sources, areas, algorithms, and system settings
        </p>
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="areas">Areas & Stations</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="ui">UI & Shortcuts</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <DataSourcesTab />
        </TabsContent>

        <TabsContent value="areas">
          <AreasTab />
        </TabsContent>

        <TabsContent value="algorithms">
          <AlgorithmsTab />
        </TabsContent>

        <TabsContent value="pipelines">
          <PipelinesTab />
        </TabsContent>

        <TabsContent value="exports">
          <div className="text-sm text-muted-foreground">Exports tab content</div>
        </TabsContent>

        <TabsContent value="ui">
          <div className="text-sm text-muted-foreground">UI & Shortcuts tab content</div>
        </TabsContent>

        <TabsContent value="users">
          <div className="text-sm text-muted-foreground">Users & Roles tab content</div>
        </TabsContent>

        <TabsContent value="system">
          <div className="text-sm text-muted-foreground">System tab content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Setup;
