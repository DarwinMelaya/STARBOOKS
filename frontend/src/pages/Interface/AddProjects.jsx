import Layout from "../../components/Layout/Layout";
const AddProjects = () => {
  return (
    <Layout activeSection="add-projects">
      <div className="h-full w-full flex flex-col bg-[#030b1a]">
        <div className="max-w-4xl w-full mx-auto my-10 flex gap-6">
          <div className="flex-1 bg-[#0b2545] text-blue-50 rounded-2xl shadow-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold">Add Projects</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProjects;
