using Angular.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Angular.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WeatherForecastController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/weatherforecast (Lấy tất cả)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeatherForecast>>> GetAll()
        {
            return await _context.WeatherForecasts.ToListAsync();
        }

        // 2. GET: api/weatherforecast/5 (Lấy theo Id)
        [HttpGet("{id}")]
        public async Task<ActionResult<WeatherForecast>> GetById(int id)
        {
            var item = await _context.WeatherForecasts.FindAsync(id);
            if (item == null) return NotFound("Không tìm thấy dữ liệu.");

            return item;
        }

        // 3. POST: api/weatherforecast (Thêm mới)
        [HttpPost]
        public async Task<ActionResult<WeatherForecast>> Create(WeatherForecast forecast)
        {
            _context.WeatherForecasts.Add(forecast);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = forecast.Id }, forecast);
        }

        // 4. PUT: api/weatherforecast/5 (Cập nhật / Sửa)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WeatherForecast forecast)
        {
            if (id != forecast.Id) return BadRequest("ID không trùng khớp.");

            _context.Entry(forecast).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.WeatherForecasts.Any(e => e.Id == id))
                    return NotFound("Không tìm thấy dữ liệu để cập nhật.");
                throw;
            }

            return NoContent();
        }

        // 5. DELETE: api/weatherforecast/5 (Xóa)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.WeatherForecasts.FindAsync(id);
            if (item == null) return NotFound("Không tìm thấy dữ liệu để xóa.");

            _context.WeatherForecasts.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công!" });
        }
    }
}
