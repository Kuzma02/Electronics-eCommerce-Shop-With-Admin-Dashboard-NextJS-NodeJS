import { test } from "vitest";
import { render } from "@testing-library/react"
import SamplePage from "@/app/sample/page";


test("Sample page render", () => {
  render(<SamplePage />)
  console.log("Sampel page render Success")

})


