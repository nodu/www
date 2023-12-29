import ContactUs from '@/components/ContactUs'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Consulting' })

export default function Page() {
  return (
    <>
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="mb-2 text-4xl font-bold">Expert Tech Consulting</h1>
        <p className="mb-4">Empowering your business with innovative solutions</p>
      </section>
      <section id="services" className="">
        <div className="container mx-auto px-6">
          <h2 className="mb-8 text-center text-3xl font-bold">Services</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">Fractional CTO</h3>
              <p className="">
                Leverage my Fractional CTO Services to guide your technology strategy and team
                mangement. I provide experienced tech leadership to help navigate complex digital
                transformations, aligning your IT goals with business objectives for optimal growth
                and efficiency.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">Architecture</h3>
              <p className="">
                I specialize in crafting robust and scalable architecture solutions for businesses
                of all sizes. My expertise lies in designing systems that are not only efficient but
                also future-proof, ensuring your business stays ahead in the ever-evolving tech
                landscape.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">Web Development</h3>
              <p className="">
                I excel in Web Application Development, creating bespoke solutions tailored to your
                unique requirements. I focus on user-centric designs, seamless functionality, and
                responsive interfaces, ensuring a superior digital experience for your customers.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">API & Integration</h3>
              <p className="">
                Unlock the potential of your business with my API Integration and Development
                services. I specialize in creating powerful APIs that enable seamless interactions
                between different software systems, enhancing connectivity and automation in your
                operations.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">CI/CD</h3>
              <p className="">
                Embrace agility with my Continuous Integration and Continuous Deployment (CI/CD)
                solutions. Streamline your software development process, enabling faster and more
                reliable code deployments with no downtime.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 border-opacity-60 p-6 shadow dark:border-gray-700">
              <h3 className="mb-2 text-xl font-bold">Cloud</h3>
              <p className="">
                Elevate your business to the cloud with my comprehensive Cloud Services. From cloud
                migration to management, I offer tailored solutions that boost efficiency, enhance
                security, and reduce operational costs.
              </p>
            </div>
          </div>
          <ContactUs />
        </div>
      </section>
    </>
  )
}
